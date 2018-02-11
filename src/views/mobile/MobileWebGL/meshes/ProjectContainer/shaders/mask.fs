#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform vec3 u_color;
varying vec2 vUV;
uniform float shininess;
uniform float opacity;
uniform float u_fullColor;
uniform float u_time;
uniform float u_ease;
uniform float u_alpha;
uniform sampler2D u_mapNoise;
uniform sampler2D u_mapDisplacement;
uniform sampler2D u_mapCircle;
uniform sampler2D t_diffuse;

varying float vRandomColor;

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

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

	vec2 uvs = vec2( vUV.x + u_time * 0.01, vUV.y );
	vec4 texture = texture2D(t_diffuse, uvs);

	// vec3 totalEmissiveRadiance = emissive * (vRandomColor * u_ease );
  vec3 totalEmissiveRadiance = texture.rgb * (vRandomColor * u_ease );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_phong_fragment>
	#include <lights_template>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	#include <envmap_fragment>


  float alpha = u_alpha;

	gl_FragColor = vec4( mix( outgoingLight, emissive, u_fullColor ), alpha );

	#include <premultiplied_alpha_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}
