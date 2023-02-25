import React from "react";
import { useState } from "react";

export const useForm = (initialObj = {}) => {
  const [form, setform] = useState(initialObj);

  const changed = ({ target }) => {
    const { name, value } = target;

    setform({
      ...form,
      [name]: value,
    });
  };

  return {
    form,
    changed,
  };
};
