import React from "react";

const SelectCarrierForm = (props) => {
  const handleSelectChange = (e) => {
    const selectedCarrier = JSON.parse(e.target.value);
    props.selectCarrier(selectedCarrier);
  };

  return (
    <form onSubmit={(e) => props.carrierSubmit(e, props.defaultCarrier)}>
      <select
        onChange={handleSelectChange}
        value={props.defaultCarrier ? JSON.stringify(props.defaultCarrier) : ""}
      >
        <option value="" disabled>
          Select your carrier
        </option>
        {props.carrierList.map((carrier) => (
          <option key={carrier._id} value={JSON.stringify(carrier)}>
            {carrier.name}
          </option>
        ))}
      </select>
      <button>Submit</button>
    </form>
  );
};

export default SelectCarrierForm;
