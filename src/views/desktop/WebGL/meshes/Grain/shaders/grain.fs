uniform sampler2D u_map;
uniform vec2 uRes;
uniform float u_alpha;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec4 texture = texture2D(u_map, vec2(vUv.x * 2.7 * ( uRes.x * 0.001), vUv.y * 2.7 * (uRes.x * 0.001)));

  vec3 color = texture.rgb;
  float alpha = texture.a * .15 * u_alpha;

  gl_FragColor = vec4(color, alpha);
}
