class EsIndex {
  constructor({ client, index, forceRefresh = false, mappings }) {
    this.forceRefresh = forceRefresh;
    this.client = client;
    this.index = index;
    this.mappings = mappings;
  }

  async ensureIndex() {
    try {
      const response = await this.client.indices.create({ index: this.index });
    } catch (err) {
      throw err;
    }

    if (this.mappings) {
      try {
        await this.client.indices.putMapping({
          index: this.index,
          body: {
            properties: this.mappings,
          },
        });
      } catch (err) {
        throw err;
      }
    }
  }

  async findById(id) {
    try {
      const doc = await this.client.get({ id: String(id), index: this.index });

      return doc && doc.body && doc.body._source
        ? { id, ...doc.body._source }
        : null;
    } catch (err) {
      if (err.meta && err.meta.statusCode && err.meta.statusCode === 404) {
        return null;
      }

      throw err;
    }
  }

  async deleteIndex() {
    const response = await this.client.indices.delete({
      index: this.index,
    });

    return response;
  }

  async delete({ id }) {
    const response = await this.client.delete({
      index: this.index,
      id,
    });

    return response;
  }

  async deleteAll() {
    const response = await this.client.deleteByQuery({
      index: this.index,
      conflicts: "proceed",
      body: { query: { match_all: {} } },
    });

    return response;
  }

  async refresh() {
    return this.client.indices.refresh({ index: this.index });
  }
}

module.exports = EsIndex;
