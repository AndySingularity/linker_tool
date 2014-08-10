module LinkerTool
  class ApplicationController < ActionController::Base
    def main_plate
      test_routes = []
      # render '_linker'
  
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
      str = render_to_string(:partial => 'linker/linker')
      str = ERB.new(str).result
      str.gsub!("\r\n","")
      # render :text => str, :layout => true
    end
  end
end
