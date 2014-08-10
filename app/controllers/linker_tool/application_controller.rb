module LinkerTool
  class ApplicationController < ActionController::Base
    def main_plate(prms)
      @params = prms
      test_routes = []
  
      Rails.application.routes.routes.each do |route|
        r = route.path.spec.to_s
        test_routes << [r,route.verb]
      end
      @str = []
      test_routes.each do |route|
        @str[@str.length] = [route[0].to_s,route[1].to_s]
        @str[@str.length-1][1].gsub!("[","")
        @str[@str.length-1][1].gsub!("]","")
        @str[@str.length-1][1].gsub!("\"","")
        @str[@str.length-1][1].gsub!("^","")
        @str[@str.length-1][1].gsub!("$","")
        @str[@str.length-1][1].gsub!("/","")
        @str[@str.length-1][1].gsub!("(?-mix:","")
        @str[@str.length-1][1].gsub!(")","")
      end

      str = render_to_string(:partial => 'layouts/linker_tool/_linker', :layout => false)
      return str.html_safe
    end
  end
end
