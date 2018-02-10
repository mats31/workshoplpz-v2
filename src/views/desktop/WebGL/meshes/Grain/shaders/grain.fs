uniform sampler2D u_map;
uniform float u_alpha;

varying vec2 vUv;

void main() {
  vec4 texture = texture2D(u_map, vUv * 1.4);

  vec3 color = texture.rgb;
  float alpha = texture.a * .15 * u_alpha;

  gl_FragColor = vec4(color, alpha);
}
