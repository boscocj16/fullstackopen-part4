const jwt = require('jsonwebtoken')
const User = require('../models/user')
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
      }
      const user = await User.findById(decodedToken.id)
      request.user = user
    } catch (error) {
      return response.status(401).json({ error: 'token invalid' })
    }
  } else {
    return response.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}
