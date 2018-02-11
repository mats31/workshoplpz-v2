// uniform sampler2D u_map;
//
// varying vec2 vUv;
//
// void main() {
//
//   vec4 texture = texture2D(u_map, vUv);
//
//   vec3 backgroundColor = vec3( 40. / 255. );
//   vec3 color = backgroundColor * texture.rgb;
//   float alpha = texture.a;
//
//   // gl_FragColor = vec4(color, alpha);
//   gl_FragColor = vec4(color, alpha);
// }

uniform vec2 u_gradient;

varying vec2 vUv;

void main() {

  vec3 bottomBackgroundColor = vec3( 26. ) / 255.;
  vec3 topBackgroundColor = vec3( 49., 50., 52. ) / 255.;
  float gradient = smoothstep( u_gradient.x, u_gradient.y, vUv.y );
  vec3 color = mix( bottomBackgroundColor, topBackgroundColor, gradient );
  float alpha = 1.;

  // gl_FragColor = vec4(color, alpha);
  gl_FragColor = vec4(color, alpha);
}
