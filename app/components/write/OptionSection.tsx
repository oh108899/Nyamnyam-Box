interface OptionSectionProps {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  sectionClassName: string;
  titleClassName: string;
  optionWrapClassName: string;
  optionButtonClassName: string;
  optionButtonActiveClassName: string;
}

export default function OptionSection({
  title,
  options,
  selected,
  onSelect,
  sectionClassName,
  titleClassName,
  optionWrapClassName,
  optionButtonClassName,
  optionButtonActiveClassName,
}: OptionSectionProps) {
  return (
    <section className={sectionClassName}>
      <h2 className={titleClassName}>{title}</h2>
      <div className={optionWrapClassName}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`${optionButtonClassName} ${selected === option ? optionButtonActiveClassName : ""}`}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
