uniform sampler2D u_map;

varying vec2 vUv;

void main() {
  vec4 texture = texture2D(u_map, vUv * 2.5);

  vec3 color = texture.rgb;
  float alpha = texture.a * .15;

  gl_FragColor = vec4(color, alpha);
}
