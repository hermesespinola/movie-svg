@import ../../../shaders/vert_base;
attribute vec3 direction;
uniform float animate;

#define PI 3.14159265359

void main(void) {
  // scale triangles to their centroids
  // centroid × (1 − triangleScale) + position × triangleScale
  float theta = (1.0 - animate) * (PI * 1.5) * sign(centroid.x);
  mat3 rotMat = mat3(
    vec3(cos(theta), 0.0, sin(theta)),
    vec3(0.0, 1.0, 0.0),
    vec3(-sin(theta), 0.0, cos(theta))
  );
  // push outward
  vec3 offset = mix(vec3(0.0), direction.xyz * rotMat, 1.0 - animate);
  vec3 trianglePos = mix(centroid.xyz, position.xyz, triangleScale) + offset;

  gl_Position = modelViewMatrix * vec4(trianglePos, 1.0);
  gl_PointSize = 1.0;
}
