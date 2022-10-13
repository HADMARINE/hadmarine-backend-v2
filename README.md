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
- [ ] Error code handler