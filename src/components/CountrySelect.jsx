import React, { useState } from "react";
import countries from "../components/countries"; // [{name, code}]
import "../styles/CountrySelect.css";

const CountrySelect = ({ value, onChange }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

 const handleSelect = (country) => {
  onChange(country); // pass the full object {name, code}
  setSearch(country.name);
  setOpen(false);
};

  return (
    <div className="country-select-wrapper">
      <input
        type="text"
        className="country-input"
        placeholder="Select your country"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        autoComplete="country-name"
      />
      {open && (
        <ul className="country-dropdown">
          {filtered.length > 0 ? (
            filtered.map((c) => (
            <li
  key={c.code}
  className="country-option"
  onClick={() => handleSelect(c)}
>
  {c.name}
</li>

            ))
          ) : (
            <li className="country-option disabled">No matches</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CountrySelect;
