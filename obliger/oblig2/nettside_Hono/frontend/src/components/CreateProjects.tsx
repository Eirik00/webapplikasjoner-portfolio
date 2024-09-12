export default function CreateProjects(){
    return(
        <form>
            <label htmlFor="projectName">Prosjekt Navn:</label>
            <input type="text" id="projectName" name="projectName" required />

            <label htmlFor="projectPrivate">Privat Prosjekt?</label>
            <input type="checkbox" id="projectPrivate" name="projectPrivate" />
            <br />
            <label htmlFor="projectDescription">Prosjekt Beskrivelse:</label>
            <textarea id="projectDescription" name="projectDescription" rows={8} cols={50}></textarea>

            <button type="submit" id="submitBtn">Lag Prosjekt</button>
        </form>
    )
}