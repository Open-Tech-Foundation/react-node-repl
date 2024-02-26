import { ChangeEventHandler } from "react";

type Props = {
  label: string;
  value: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export default function Switch({ label, value, onChange }: Props) {
  return (
    <div style={{ display: "inline-flex" }}>
      <span style={{ marginRight: "5px", fontSize: "15px" }}>{label}</span>
      <label className="switch">
        <input type="checkbox" checked={Boolean(value)} onChange={onChange} />
        <span className="slider round" />
      </label>
    </div>
  );
}
