import { createTransform } from 'redux-persist';

const SetTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState, key) => {
    // console.log('key', key)
    
    // if (key === 'project') {

    const {
      projects,
      activeId,
      activeXterm,
      isNew
    } = inboundState

      const res = {
        // activeId,
        projects: projects.map(p => ({
          id: p.id,
          name: p.name,
          cwd: p.cwd
        }))
      }

      return res
    // }
    // return { ...inboundState }
  },
  
  // transform state being rehydrated
  (outboundState, key) => {
    // convert mySet back to a Set.
    // if (key === 'project') {

    //   const res = { projects: outboundState.projects.map(p => ({ cwd: p.cwd })) }

    //   return res
    // }
    return { ...outboundState }
  },
  // define which reducers this transform gets called for.
  { whitelist: ['project'] }

);

export default SetTransform;