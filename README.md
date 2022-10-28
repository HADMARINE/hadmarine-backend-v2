# TODO 

- [ ] Make cron service and add this function
  ```typescript
  async function removeExpiredToken(): Promise<number> {
    try {
      const result = await Session.deleteMany({
        expire: { $lt: Math.floor(Date.now() / 1000) },
      }).exec();

      return result.deletedCount || 0;
    } catch {
      logger.debug('Token auto removal failed');
    }
    return 0;
  }
  ```
- [x] Error code handler
- [x] env var verifier
- [x] Dto class verifier : https://docs.nestjs.com/techniques/validation
- [x] Health Checks : https://docs.nestjs.com/recipes/terminus
- [x] CronJob : https://docs.nestjs.com/techniques/task-scheduling
- [ ] Swagger
- [ ] Session controller
- [ ] Testing
- [ ] Refresh Token invalid/expired -> cookie auto removal
- [ ] Access Token expired -> refresh token auto renewal


# REF
## Token invalidation
https://medium.com/@byeduardoac/managing-jwt-token-expiration-bfb2bd6ea584

## NestJS basics
https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/