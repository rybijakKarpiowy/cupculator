'use client'

export default function Login() {
    const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        console.log(email, password)
    }

    return (
        <div>
        <form className="flex flex-col content-center">
            <div className="flex flex-row justify-center">
                <label htmlFor="email">Email: </label>
                <input id="email" type="email" />
            </div>
            <div className="flex flex-row justify-center">
                <label htmlFor="password">Hasło: </label>
                <input id="password" type="password" />
            </div>
            <button type="submit" onClick={(e) => handleSubmit(e)}>Zaloguj</button>
        </form>
        <span>Nie masz konta? <a href="/register">Zarejestruj się</a></span>
        <a>Zapomniałeś hasła?</a>
        </div>
    );
}
