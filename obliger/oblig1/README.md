### Features


# Sequence Diagram
- POST
```mermaid
sequenceDiagram
    Bruker->>Side: Initialiserer oprettelse av et nytt prosjekt
    Side->>Server: HTTP POST med sending av prosjekt data
    Server->>DB: Sett inn nytt prosjekt i databasen
    DB-->>Server: Bekreft prosjektopprettelse
    Server-->>Side: Sender godkjenning av prosjektopprettelse
    Side-->>Bruker: Viser bekreftelse til brukeren
```

- GET
```mermaid
sequenceDiagram
	Bruker->>Side: initialiser siden
	Side->>Server: Hent ut data fra databasen
	Server->>DB: Forespørsel om data
	DB-->>Server: Sender data
	Server-->>Side: Formaterer dataen slik at den tilpasser siden
	Side-->>Bruker: Viser siden med formatert og lesbart data
```

# Wireframe
[Figma](https://www.figma.com/design/nlEgmvrbsPSFYl8yZK8GK1/Wireframing-(Copy)?node-id=0-1&t=CHKSLy4g1wgXLhle-1)
#### Home Page
![Wireframe of Homepage](https://github.com/Eirik00/webapplikasjoner-portfolio/blob/portfolio-v1/obliger/oblig1/Wireframe_Home_Page.png "Wireframe of Website")
#### Create Project Page
![Wireframe of Create Porject Page](https://github.com/Eirik00/webapplikasjoner-portfolio/blob/portfolio-v1/obliger/oblig1/Wireframe_Create_Project.png "Wireframe of Website")

### Network data
#### Home Page
![Network data from Home Page](https://github.com/Eirik00/webapplikasjoner-portfolio/blob/portfolio-v1/obliger/oblig1/Network_Home_Page.png "Network data from Home Page")
#### Create Project Page
![Network data from Create Project Page](https://github.com/Eirik00/webapplikasjoner-portfolio/blob/portfolio-v1/obliger/oblig1/Network_Create_Project.png "Network data from Project Page")