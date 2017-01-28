// uniform float u_time;

varying vec2 vUV;
varying vec3 vPos;
varying vec4 vModelPos;

void main() {

  vUV = uv;
  vPos = position;
  vModelPos = modelViewMatrix * vec4( position, 1.0 );

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
