const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";


export const getImageUrl =
  (imageUrl) => {

    if (!imageUrl) {
      return "";
    }


    /*
     * Already a complete URL
     */

    if (
      imageUrl.startsWith(
        "http://"
      ) ||
      imageUrl.startsWith(
        "https://"
      )
    ) {

      return imageUrl;

    }


    /*
     * Remove accidental leading slash
     */

    const cleanPath =
      imageUrl.startsWith("/")
        ? imageUrl.substring(1)
        : imageUrl;


    return `${API_URL}/${cleanPath}`;

  };

