uniform sampler2D u_map;
uniform vec3 u_translation;

varying vec2 vUv;

void main() {

  vec4 texture = texture2D(u_map, vUv);

  vec3 color = mix( vec3(0.), texture.rgb, u_translation.z );
  // vec3 color =  vec3(1.,0.,0.);
  float alpha = texture.a;

  gl_FragColor = vec4(color, alpha);
}
