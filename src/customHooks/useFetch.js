import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";

const useFetch = (url) => {
  const [data, PutData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const showSnackBar = (msg, variant) => {
    enqueueSnackbar(msg, {
      variant: variant,
      snackbarprops: 'data-role="alert"',
    });
  };

  const GetData = () => {
    try {
      axios
        .get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
        .then((response) => {
          PutData(response.data);
        })
        .catch((err) => {
          showSnackBar("Network Error", "error");
        });
    } catch (err) {
      showSnackBar("Something went wrong", "error");
    }
  };

  useEffect(() => {
    GetData();
  }, [url]);

  return [data];
};

export default useFetch;
