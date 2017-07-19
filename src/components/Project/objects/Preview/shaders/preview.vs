uniform sampler2D u_map_mask;
uniform sampler2D u_map_wind;
uniform vec2 u_resolution;
uniform vec3 u_translation;
uniform float u_time;

varying vec2 vUv;

void main() {

  vUv = uv;

  vec4 windTexture = texture2D(u_map_wind, vec2( vUv.x + u_time * 0.03, vUv.y ) );
  vec4 windTexture2 = texture2D(u_map_wind, vUv );
  vec4 windTexture3 = texture2D(u_map_wind, vec2( vUv.x - 1., vUv.y -1. ) );
  vec4 maskTexture = texture2D(u_map_mask, vUv );

  vec3 pos = position;

  pos.x += ( ( 100. * abs( u_translation.y - 1. ) ) * windTexture2.r );
  pos.x -= ( ( 100. * abs( u_translation.y - 1. ) ) * windTexture3.r );
  pos.y -= ( u_resolution.y ) * abs( u_translation.y - 1. );
  pos.z += ( ( .7 + ( 3000. * abs( u_translation.y - 1. ) ) ) * windTexture.r ) * maskTexture.r;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
