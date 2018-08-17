module.exports = class Database {

  constructor(model) {
    this.Model = model;
  }

  aggregate(query) {
    return this.Model.aggregate(query);
  }

  get(query = {}, opt = {}) {
    let q = this.Model.findOne(query, opt);
    return q.exec();
  }

  getAll(query = {}, opt = {}, other = {}) {
    let q = this.Model.find(query, opt, other);
    return q.exec();
  }

  insert(model) {
    return model.save();
  }

  update(query, model) {
    return this.Model.findOneAndUpdate(query, { $set: model }, { safe: true, upsert: false });
  }

  delete(query) {
    return this.Model.deleteOne(query);
  }

  // update(data, query) {
  //     return this.Model.findByIdAndUpdate(data, query, { safe: true, upsert: true });
  // }

  // getProjectsByAddress(query) {
  //     return this.Model.find(query).select('projects -_id');
  // }

  // updatePull(query) {

  //     return this.Model.update({}, query, { "multi": true });
  // }

}