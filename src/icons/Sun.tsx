export function IconSun() {
  return (
    <svg width="48" height="48" viewBox="0 0 400 400" aria-hidden="true">
      <circle fill="#e5dd00" cx="200" cy="200" r="80">
        <animate
          attributeName="r"
          fill="freeze"
          dur="0.5s"
          begin="0s"
          restart="always"
          values="140 ; 80"
          calcMode="spline"
          keyTimes="0 ; 1"
          keySplines="0.25 1 0.5 0.9"
        />
      </circle>
      <path
        fill="none"
        stroke="#e5dd00"
        strokeWidth="25"
        strokeLinecap="round"
        d="
M 200 200 m 120 0 l 40 0
M 200 200 m -120 0 l -40 0
M 200 200 m 0 120 l 0 40
M 200 200 m 0 -120 l 0 -40
M 200 200 m 84.8528 84.8528 l 28.2843 28.2843
M 200 200 m -84.8528 84.8528 l -28.2843 28.2843
M 200 200 m -84.8528 -84.8528 l -28.2843 -28.2843
M 200 200 m 84.8528 -84.8528 l 28.2843 -28.2843
"
      >
        <animate
          attributeName="d"
          fill="freeze"
          dur="0.5s"
          begin="0s"
          restart="always"
          values="
M 200 200 m 0 0 l 40 0
M 200 200 m 0 0 l -40 0
M 200 200 m 0 0 l 0 40
M 200 200 m 0 0 l 0 -40
M 200 200 m 0 0 l 28.2843 28.2843
M 200 200 m 0 0 l -28.2843 28.2843
M 200 200 m 0 0 l -28.2843 -28.2843
M 200 200 m 0 0 l 28.2843 -28.2843 ;

M 200 200 m 120 0 l 40 0
M 200 200 m -120 0 l -40 0
M 200 200 m 0 120 l 0 40
M 200 200 m 0 -120 l 0 -40
M 200 200 m 84.8528 84.8528 l 28.2843 28.2843
M 200 200 m -84.8528 84.8528 l -28.2843 28.2843
M 200 200 m -84.8528 -84.8528 l -28.2843 -28.2843
M 200 200 m 84.8528 -84.8528 l 28.2843 -28.2843
"
          calcMode="spline"
          keyTimes="0 ; 1"
          keySplines="0.25 1 0.5 0.9"
        />
      </path>
    </svg>
  );
}
