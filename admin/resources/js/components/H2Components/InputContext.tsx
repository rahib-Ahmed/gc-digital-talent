import React from "react";

const InputContext: React.FC<{ isVisible: boolean; error: string }> = ({
  error,
  isVisible,
}) => {
  return isVisible ? (
    <p
      data-h2-display="b(inline-block)"
      data-h2-radius="b(s)"
      data-h2-bg-color="b(lightpurple[.1])"
      data-h2-padding="b(all, xs)"
      data-h2-color="b(lightpurple)"
      data-h2-font-size="b(caption)"
      role="alert"
    >
      {error}
    </p>
  ) : null;
};

export default InputContext;
