interface ButtonComponentProps {
  title: string;
  black?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonComponentProps> = ({
  title,
  black = false,
  onClick,
}) => {
  return (
    <button
      className={`py-4 px-8 border-2 border-[#161617] rounded-3xl h-full ${
        black ? "bg-black text-white" : "bg-[#FDFFFB] text-[#161617]"
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
