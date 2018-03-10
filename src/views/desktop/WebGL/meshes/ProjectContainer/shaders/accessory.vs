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

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

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

	// transformed.x += ( cos( u_time * u_speed ) * .5 ) * u_direction.x;
	// transformed.y += ( sin( u_time * u_speed ) * .5 ) * u_direction.y;
	// vec3 finalPosition = a_finalPosition;
	//
	// transformed = mix( transformed, finalPosition, u_morph );

	#include <displacementmap_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>

#ifdef USE_SKINNING

	vec4 mvPosition = modelViewMatrix * skinned;

#else

	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );

#endif

	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>

  vUV = uv;
  vRandomColor = a_randomColor;
}
