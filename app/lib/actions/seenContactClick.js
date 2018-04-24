export const handleSeenContactClick = (seenFunc, itemId, dispatch, itemViewed, currentAction) => () => {
  seenFunc(dispatch, itemId, itemViewed, currentAction)
}
