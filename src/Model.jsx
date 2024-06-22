/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: dwalsh (https://sketchfab.com/dwalsh)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/energy-drink-game-ready-model-83676feb8b0a4589952cf3676299311b
Title: Energy Drink Game Ready Model
*/

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Color, Vector2 } from "three";
import { animate } from "framer-motion";
import { easeQuadIn, easeQuadOut } from "d3-ease";

import { noise } from "./Noise";
import { useStore } from "./store";
import { colors } from "./data";

import model from "./assets/models/energy-can.glb?url";

const Model = (props) => {
  const { nodes, materials } = useGLTF(model);

  const {
    viewport: { width, height },
  } = useThree();

  const modelRef = useRef();
  const [current, setCurrent] = useState(0);

  const play = useStore((s) => s.play);
  const setPlay = useStore((s) => s.setPlay);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_color1: { value: new Color(colors[0]) },
      u_color2: { value: new Color(colors[1]) },
      u_progress: { value: 0.5 },
      u_width: { value: 0.8 },
      u_scaleX: { value: 50 },
      u_scaleY: { value: 50 },
      u_textureSize: {
        value: new Vector2(
          materials.Body.map.source.data.width,
          materials.Body.map.source.data.height
        ),
      },
    }),
    [colors]
  );

  const handleClick = () => {
    let len = colors.length;
    let nextTexture = new Color(colors[(current + 1) % len]);
    uniforms.u_color2.value = nextTexture;

    if (play) {
      animate(0.5, 1, {
        onUpdate(v) {
          setPlay(false);
          uniforms.u_progress.value = v;
        },
        onComplete() {
          setCurrent((current + 1) % len);

          uniforms.u_color1.value = nextTexture;
          uniforms.u_progress.value = 0.5;
          setPlay(true);
        },

        duration: 1,
        ease: easeQuadOut,
      });
    }
  };

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    uniforms.u_time.value = time;

    modelRef.current.position.y = Math.sin(time) * 0.12;
  });

  useEffect(() => {
    materials.Body.metalness = 0;
    materials.Body.roughness = 1;
    materials.Body.onBeforeCompile = (shader) => {
      shader.uniforms = Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader.replace(
        `#include <common>`,
        `
          #include <common>


          varying vec2 vUv;

        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
          #include <begin_vertex>

          vUv = uv;
        `
      );

      // Fragment Shader

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <common>`,
        `
          #include <common>

          uniform float u_time;
          uniform vec3 u_color1;
          uniform vec3 u_color2;
          uniform float u_progress;
          uniform float u_width;
          uniform float u_scaleX;
          uniform float u_scaleY;
          uniform vec2 u_textureSize;



          varying vec2 vUv;

          
          ${noise}


          float parabola( float x, float k ) {
            return pow( 4. * x * ( 1. - x ), k );
          }


      `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <color_fragment>`,
        `
          #include <color_fragment>

            float aspect = u_textureSize.x/u_textureSize.y;

            float dt = parabola(u_progress,1.);
            float border = 1.;

            float noise = 0.5*(cnoise(vec4(vUv.x*u_scaleX  + 0.5*u_time/3., vUv.y*u_scaleY,0.5*u_time/3.,0.)) + 1.);

            float w = u_width*dt;

            float maskValue = smoothstep(1. - w,1.,vUv.y + mix(-w/2., 1. - w/2., u_progress));

            maskValue += maskValue * noise;

            float mask = smoothstep(border,border+0.01,maskValue);

            diffuseColor.rgb += mix(u_color1,u_color2,mask);


        `
      );
    };
  }, [uniforms]);

  return (
    <>
      {/* Plane helper for click event */}
      <mesh visible={false} onClick={() => handleClick()}>
        <planeGeometry args={[width, height]} />
      </mesh>

      <group
        ref={modelRef}
        rotation={[-Math.PI / 2, 1.7, Math.PI / 2]}
        position={[0, 0, 5]}
        {...props}
        dispose={null}
      >
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <mesh
            geometry={nodes.LowRes_Can_Alluminium_0.geometry}
            material={materials.Alluminium}
          />
          <mesh
            geometry={nodes.LowRes_Can_Body_0.geometry}
            material={materials.Body}
          />
        </group>
      </group>
    </>
  );
};

useGLTF.preload(model);

export default Model;
