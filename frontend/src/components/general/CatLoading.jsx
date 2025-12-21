import { memo } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const CatLoading = memo(() => {

    return (
        <DotLottieReact
            src="/loading.lottie"
            loop
            autoplay
            className="loading-icon"
        />
    );
});

export default CatLoading;
