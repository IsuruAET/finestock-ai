const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#FFFCEF]">
      <div className="flex flex-col items-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 80 80"
          width="80"
          height="80"
          role="img"
          aria-label="Loading"
          className="text-[#ff7a00]"
          style={{ "--main": "#ff7a00" } as React.CSSProperties}
        >
          <defs>
            <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.6" result="b" />
              <feBlend in="SourceGraphic" in2="b" mode="normal" />
            </filter>
          </defs>

          <g transform="translate(40,40)">
            <g>
              <circle
                cx="0"
                cy="0"
                r="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeOpacity="0.12"
              />
              <g>
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0"
                  to="360"
                  dur="1.4s"
                  repeatCount="indefinite"
                />
                <g filter="url(#soft)">
                  <circle cx="0" cy="-22" r="4" fill="currentColor">
                    <animate
                      attributeName="cy"
                      values="-22;-26;-22"
                      dur="0.9s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="r"
                      values="4;6;4"
                      dur="0.9s"
                      repeatCount="indefinite"
                      begin="0s"
                    />
                  </circle>
                  <circle
                    cx="0"
                    cy="-22"
                    r="4"
                    fill="currentColor"
                    transform="rotate(120)"
                  >
                    <animate
                      attributeName="r"
                      values="4;6;4"
                      dur="0.9s"
                      repeatCount="indefinite"
                      begin="0.15s"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0;120"
                      dur="0.9s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="0"
                    cy="-22"
                    r="4"
                    fill="currentColor"
                    transform="rotate(240)"
                  >
                    <animate
                      attributeName="r"
                      values="4;6;4"
                      dur="0.9s"
                      repeatCount="indefinite"
                      begin="0.3s"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0;240"
                      dur="0.9s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
