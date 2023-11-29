export const Button = ({onClick, children, className}) => <button onClick={onClick} className={"click-link-button " + className}>
    <div>{children}</div>
</button>