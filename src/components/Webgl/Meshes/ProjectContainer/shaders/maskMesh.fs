#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
varying vec2 vUV;
uniform float shininess;
uniform float opacity;
uniform float u_time;
uniform float u_ease;
uniform float u_alpha;
uniform sampler2D u_mapNoise;
uniform sampler2D u_mapDisplacement;
uniform sampler2D u_mapCircle;

#include <common>
#include <packing>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_flip>
	#include <normal_fragment>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_phong_fragment>
	#include <lights_template>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	#include <envmap_fragment>

  vec2 customUv1 = vec2( vUV.x + u_time * 0.1, vUV.y + u_time * 0.1 );
  vec2 customUv2 = vec2( vUV.x - u_time * 0.1, vUV.y - u_time * 0.1 );
  vec4 displacementTexture1 = texture2D(u_mapDisplacement, vec2(vUV.x + u_time * 0.1, vUV.y + u_time * 0.1 ) );
  vec4 displacementTexture2 = texture2D(u_mapDisplacement, vec2(vUV.x - u_time * 0.1, vUV.y - u_time * 0.1 ) );
  vec4 noiseTexture = texture2D(u_mapNoise, vUV + displacementTexture1.r * 0.05 + displacementTexture2.r * 0.05 );
  vec4 noiseTexture1 = texture2D(u_mapNoise, customUv1 );
  vec4 noiseTexture2 = texture2D(u_mapNoise, customUv2 );
  vec4 circleTexture1 = texture2D(u_mapCircle, vec2( vUV.x, vUV.y + noiseTexture1.r * u_ease - 0.5 ) );
  vec4 circleTexture2 = texture2D(u_mapCircle, vec2( vUV.x, vUV.y - noiseTexture2.r * u_ease + 0.5 ) );
  // vec4 noiseTexture = texture2D(u_mapNoise, ( vUV + u_time * 0.1 ) * 0.4 );
  // vec4 noiseTexture2 = texture2D(u_mapNoise, ( vUV - u_time * 0.1 ) * 0.4 );

  // float randomValue = sign( rand(gl_FragCoord.xy) - 0.5 );
  // float noise = max( snoise(u_time + gl_FragCoord.xy * 0.012 * randomValue), 0. );
  // float noise = snoise( fract( u_time) * gl_FragCoord.xy * 0.001);

  float alpha = u_alpha * ( smoothstep( 0.05, 0.2 , abs( noiseTexture.a - 1. ) ) + abs( 1. - u_ease ) );
  // float alpha = diffuseColor.a * ( noiseTexture.r * noiseTexture2.r * 3. );
  // float alpha = abs( circleTexture1.a - 1. ) * abs( circleTexture2.a - 1. ) + abs( u_ease - 1. );
  // float alpha = 1.;
  // float alpha = 0.;

  gl_FragColor = vec4( outgoingLight, alpha );
	// gl_FragColor = vec4( noiseTexture.rgb, 1. );

	#include <premultiplied_alpha_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>

}

// varying vec2 vUv;
// varying vec3 vNormal;
// varying vec3 vWorldPosition;
//
// void main() {
//
//   vec3 lightDirection = normalize( vec3(-2000., 2000., -2000.) - vWorldPosition );
//   // vec3 lightDirection = normalize( vec3(0., 0., 0.) - vWorldPosition );
//
//   float alpha = 1.;
//
//   float c = 0.95 + max( 0.0, dot( vNormal, lightDirection ) ) * 0.4;
//   vec3 color = vec3(.5) * c;
//
//   gl_FragColor = vec4(color, alpha);
// }
