#!/usr/bin/env ruby

# Copyright 2015 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Sample app that connects to a Greeter service.
#
# Usage: $ path/to/greeter_client.rb

# this_dir = File.expand_path(File.dirname(__FILE__))
# lib_dir = File.join(this_dir, 'lib')
# $LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require './file-validation_services_pb.rb'
# require '/Users/himanshuyadav/Desktop/Learn/grpc-learn/client/ruby/file-validation_services_pb.rb'

def main
  stub = FileValidationPackage::FileValidation::Stub.new('localhost:50051', :this_channel_is_insecure)
  begin
    message = stub.hello_service(Google::Protobuf::Empty.new)
    p "Gretting reply: #{message.message}"
  rescue GRPC::BadStatus => e
    abort "ERROR: #{e.message}"
  end
end

main
