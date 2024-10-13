import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Enter({ signIn }) {
  const { name, link } = useParams();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (name && link && !isSigningIn) {
      setIsSigningIn(true);
      const decodedName = decodeURIComponent(name);
      const decodedLink = decodeURIComponent(link);

	  //This is bad practice
      signIn(decodedName, "", decodedLink)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Sign-in failed:", error);
        })
        .finally(() => {
          setIsSigningIn(false);
        });
    }
  }, [name, link, signIn, navigate, isSigningIn]);

  return (
    <div>
      <p>Processing your sign-in...</p>
    </div>
  );
}

export default Enter;
