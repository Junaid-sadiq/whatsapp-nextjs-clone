import { Circle } from 'better-react-spinkit';
export default function Loading() {
    return (
        <center
            style={{
                display: 'grid',
                placeItems: 'center',
                height: '100vh',
                backgroundColor: '#131c21',
            }}
        >
            <div>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/225px-WhatsApp.svg.png"
                    alt="Logo"
                    style={{
                        marginBottom: '50px',
                    }}
                    height={200}
                />
                <Circle size={60} color="#3cbc28" />
            </div>
        </center>
    );
}
