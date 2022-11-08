'use strict'
const AWS = require('aws-sdk')
const uuid = require('uuid/v1')
// const keys = require('../../../config/dev')
// const s3 = new AWS.S3({
//   accessKeyId: keys.accessKeyId,
//   secretAccessKey: keys.secretAccessKey
// })
const Url = require("url-parse");
const Env = use("Env");
const Helpers = use('Helpers')
const Database = use('Database')
const Attachment = use('App/Models/Attachment')
const Company = use('App/Models/Company')

const ACCESS_KEY_ID = new Url(Env.get('ACCESS_KEY_ID'))
const SECRET_ACCESS_KEY = new Url(Env.get('SECRET_ACCESS_KEY'))

const s3 = new AWS.S3({
  accessKeyId: Env.get('ACCESS_KEY_ID', ACCESS_KEY_ID),
  secretAccessKey: Env.get('SECRET_ACCESS_KEY', SECRET_ACCESS_KEY)
})

class AttachmentController {
  async uploadAwsFile({ auth, request, response }) {

    //type is rateconfirmation or bol
    const type = await request.only('type')
    const fileName = await request.only('fileName')
    const fieldName = await request.only('fieldName')
    // fieldName:"expense_id", id:33 etc..
    let newFieldValues = { ...JSON.parse(fieldName.fieldName) }

    //rateconfirmation/uuid/Invoice501-rate.pdf
    const key = `${type.type}/${uuid()}/${fileName.fileName}`

    try {
      const uploadLink = await s3.getSignedUrl('putObject', {
        Bucket: 'simpletrucker',
        // ContentType:"image/jpeg",
        ContentType: 'application/pdf',
        ContentDisposition: 'inline',
        Key: key
      })

      const currentCompany = await Company.query()
         .where({ id: auth.user.company_id })
        .first()

      const attachmentCreate = await Attachment.create({
        attachment: key,
        company_id: currentCompany.id,
        [newFieldValues.fieldName]: newFieldValues.id
      })
      return { uploadLink, key }
    } catch (error) {
      console.log("error")
    }
  }

  async uploadAwsFileLoads({ auth, request, response }) {
    //type is rateconfirmation or bol
    const type = await request.only('type')
    const fileName = await request.only('fileName')


    //rateconfirmation/uuid/Invoice501-rate.pdf
    const key = `${type.type}/${uuid()}/${fileName.fileName}`
    // return key
    try {
      const uploadLink = await s3.getSignedUrl('putObject', {
        Bucket: 'simpletrucker',
        // ContentType:"image/jpeg",
        ContentType: 'application/pdf',
        ContentDisposition: 'inline',
        Key: key
      })
      return { uploadLink, key }
    } catch (error) {
    console.log("error attachment")
    }
  }

  async deleteAwsFileLoads({ auth, request, response }) {
    const delValues = await request.all()
    try {
      const url = delValues.link

      let params = {
        Bucket: 'simpletrucker',
        Key: url
      }
      s3.deleteObject(params, function(err, data) {
        if (err) {
          return 'error'
        } // an error occurred
        else {
          console.log('success')
          // return { id: delValues.id, [delValues.fieldName]: null }
        }
      })
      response.send({ id: delValues.id, [delValues.fieldName]: null })
    } catch (error) {

      return 'error'
    }
  }

  async deleteAwsFile({ auth, request, response }) {
    const delValues = await request.all()
    let url = delValues.link.map(item=>JSON.parse(item))
    let params = {
      Bucket: 'simpletrucker',
      Delete: {
          Objects:url,
          Quiet: false
      }
    };

    try {

      s3.deleteObjects(params, function(err, data) {
        if (err) {

          return 'error'
        }
        else {
          console.log('success')
          // return { id: delValues.id, [delValues.fieldName]: null }
        }
      })
      for(let id of delValues.id){
        const attachmentDelete = await Database.table('attachments')
          .where('id', id)
          .delete()
      }


      // response.send({ id: delValues.id, [delValues.fieldName]: null })
    } catch (error) {

      return 'error'
    }
  }
}

module.exports = AttachmentController
