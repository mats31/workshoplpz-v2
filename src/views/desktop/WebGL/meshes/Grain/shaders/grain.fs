uniform sampler2D u_map;
uniform float u_alpha;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec4 texture = texture2D(u_map, vec2(vUv.x * 2.2, vUv.y * 2.2));

  vec3 color = texture.rgb;
  float alpha = texture.a * .15 * u_alpha;

  gl_FragColor = vec4(color, alpha);
}
