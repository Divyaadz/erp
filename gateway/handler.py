from google.appengine.api import users
import webapp2
import logging
import json
from controller.render import renderTemplate

class BaseHandler(webapp2.RequestHandler):

    def set_user(self, user):
        self.user = user
        
    def render_login(self):
        self.redirect(users.create_login_url(self.request.uri))
        
    def render_logout(self):
        self.redirect(users.create_logout_url("/"))
    
    def render_home(self):
        self.response.out.write(renderTemplate('index.html', {"user": self.user}))
        
    def render_report(self):
        self.response.out.write(renderTemplate('report.html', {"user": self.user}))
        
    def get_products(self):
        from model.products import productDict
        self.response.write(json.dumps(productDict))