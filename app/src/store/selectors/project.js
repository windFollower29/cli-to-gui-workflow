
import { createSelector } from 'reselect'

const projectsSelector = state => state.project.projects

const activeIdSelector = state => state.project.activeId

export const getActiveProject = createSelector(
  projectsSelector,
  activeIdSelector,
  (projects, id) => {
    // console.log('getActiveProject')
    // if (!id) return null
    return projects.find(p => p.id === id)
  }
)

export const getXtermList = createSelector(
  projectsSelector,
  activeIdSelector,
  (projects, id) => {

    const project = projects.find(p => p.id === id)

    // must return a new "xterms", otherwhiles, it cannot update
    const xterms = (project && project.xterms) ? [...project.xterms] : []

    return xterms
  }
)