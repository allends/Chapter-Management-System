export const getCurrentUser = async () => {
  const resp = await fetch('/api/user', {
    method: 'GET',
    cache: 'no-cache'
  })
  const json = resp.json()
  return json
}
