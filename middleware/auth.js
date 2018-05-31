export default function ({store, redirect}) {

    if(process.static) {
        console.log("static process");
        return;
    }

    if(store.state.auth  === null)
    {
        redirect("/")
    }
    
}