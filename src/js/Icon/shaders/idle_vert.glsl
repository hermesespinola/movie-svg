@import ../../../shaders/vert_base;
// centroid of this point's triangle
attribute vec3 centroid;
uniform float pointSize;
uniform float scale;

#define PI 3.14159265359

void main(void) {
  // scale triangles to their centroids
  // centroid × (1 − scale) + position × scale
  vec3 trianglePos = mix(centroid.xyz, position.xyz, scale);

  gl_Position = modelViewMatrix * vec4(trianglePos, 1.0);
  gl_PointSize = pointSize;
}
