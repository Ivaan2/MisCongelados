# Networking_Diagram

Diagrama de arquitectura a alto nivel con foco en el networking entre componentes.

```mermaid
flowchart LR
  user[Usuario\nNavegador] -->|HTTPS| front[Front\nNext.js UI]

  subgraph google_cloud[Google Cloud / Firebase]
    apphost[Google App Hosting]
    back[Back\nAPI / Server]
    auth[Google Auth\n(Firebase Auth / OAuth2)]
    secrets[Google Secret Manager]
  end

  front -->|HTTPS| back
  front -->|OAuth2| auth
  back -->|Verify ID Token| auth
  back -->|Read Secrets| secrets

  apphost --- front
  apphost --- back
```
