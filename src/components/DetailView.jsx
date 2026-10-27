import { useParams } from "react-router-dom"
function DetailView(){
    const { name } = useParams()
    return(
    <>
        <h1>{name}</h1>
        <h2>{}</h2>
    </>
    )
}

export default DetailView