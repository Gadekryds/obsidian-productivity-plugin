
>[!tip] Shortcuts
>| **Action**          | **Shortcuts**       |
> | --------------- | ---------------- |
> | Create Task     | `[Alt] + [T]`   |
> | Create Project  | `[Alt] + [P]`  |
> | Create Doc      | `[Alt] + [G]`   |
> | Go to Dashboard | `[Alt] + [H]`   |
> | Update Task     | `[Ctrl] + [U]` |
> | Change status | `[Ctrl] + [◀] or [▶]` |
> | Brag list | [[Brag list]] |
>
# Tasks

```base 
views:
  - type: table
    name: Open Tasks
    filters:
      and:
        - kind == "Task"
        - status != "Done"
    order:
      - file.name
      - project
      - due
      - status
      - file.mtime
    sort:
      - property: file.mtime
        direction: DESC
      - property: status
        direction: ASC
    columnSize:
      file.name: 240
      note.project: 189
      note.due: 190
      note.status: 204

```

# Projects

```base
views:
  - type: cards
    name: Open Projects
    filters:
      and:
        - kind == "Project"
        - status != "Done"
    order:
      - file.name
      - project
      - due
      - status
      - file.mtime
    sort:
      - property: status
        direction: ASC
    cardSize: 200

```

# Goals

>[!Success] Goals
> * Define your goals

# Learnings / Docs

```base 
views:
  - type: table
    name: Learnings
    filters:
      and:
        - kind == "Documentation"
    order:
      - file.name
      - summary
      - project
      - file.mtime
      - tags
    sort:
      - property: summary
        direction: ASC
      - property: file.mtime
        direction: DESC
    columnSize:
      file.name: 372
      note.project: 198

```
