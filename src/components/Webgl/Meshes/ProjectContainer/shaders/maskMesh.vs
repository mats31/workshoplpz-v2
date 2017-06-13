#define PHONG

varying vec3 vViewPosition;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

attribute vec3 a_finalPosition;
attribute float a_randomColor;

uniform vec2 u_direction;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;
uniform float u_morph;
uniform float u_translationOffset;

varying vec3 vWorldPosition;
varying vec2 vUV;
varying float vRandomColor;

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

	vNormal = normalize( transformedNormal );

#endif

	#include <begin_vertex>

	transformed.x += ( cos( u_time * u_speed ) * 10. ) * u_direction.x;
	transformed.y += ( sin( u_time * u_speed ) * 10. ) * u_direction.y;
	vec3 finalPosition = a_finalPosition;
	// finalPosition.x += u_resolution.x * 0.4 * u_translationOffset;
	// finalPosition.x += 100. / 1.997700021202425;
	transformed = mix( transformed, finalPosition, u_morph );

  // float offset = snoise(transformed.xy * 0.015 + u_time * 0.05) * 10.;
  // transformed.z += abs( offset );

	#include <displacementmap_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>

  vUV = uv;
  vRandomColor = a_randomColor;
}

// void main() {
//
//   vUv = uv;
//
//   float offset = snoise(position.xy * 0.015 + u_time * 0.05) * 10.;
//
//   vec3 newPosition = position;
//   newPosition.z += abs( offset );
//
//   vec3 newNormal = normal;
//   newNormal.z += normalize(offset);
//
//   vNormal = normalMatrix * newNormal;
//
//   vec4 worldPosition = modelMatrix * vec4(newPosition, 1.);
//   vWorldPosition = worldPosition.xyz;
//
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
// }
