uniform sampler2D u_map;

varying vec2 vUv;

void main() {

  vec4 texture = texture2D(u_map, vUv);

  vec3 backgroundColor = vec3( 40. / 255. );
  vec3 color = backgroundColor * texture.rgb;
  float alpha = texture.a;

  gl_FragColor = vec4(color, alpha);
}
