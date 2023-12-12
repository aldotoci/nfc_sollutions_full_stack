export const Button = ({onClick, children, className}) => (
    <button style={{cursor: 'pointer'}} onClick={onClick} className={"click-link-button " + className}>
        <div>{children}</div>
    </button>
)